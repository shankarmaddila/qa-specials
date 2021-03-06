// Generated by CoffeeScript 1.12.7
(function() {
  (function() {
    (function() {
		console.log("prod");
      var Firebase, _, _s, addImageData, azure, cmd, csv, directory, extractColors, extractCustoms, fileService, fileShare, fileShareKey, getLatestCSV, imageList, imagesSaved, jsonFile, missed, missedPartNumbers, options, parseCSV, parseString, partNumbers, request, revision, saveJSON, share, toPercent, total, zeroFill;
      Firebase = void 0;
      _ = void 0;
      _s = void 0;
      addImageData = void 0;
      azure = void 0;
      cmd = void 0;
      csv = void 0;
      directory = void 0;
      extractColors = void 0;
      extractCustoms = void 0;
      fileService = void 0;
      fileShare = void 0;
      fileShareKey = void 0;
      getLatestCSV = void 0;
      imageList = void 0;
      imagesSaved = void 0;
      jsonFile = void 0;
      missed = void 0;
      missedPartNumbers = void 0;
      options = void 0;
      parseCSV = void 0;
      parseString = void 0;
      partNumbers = void 0;
      request = void 0;
      revision = void 0;
      saveJSON = void 0;
      share = void 0;
      toPercent = void 0;
      total = void 0;
      zeroFill = void 0;
      azure = require('azure-storage');
      csv = require('csv');
      jsonFile = require('jsonfile');
      _ = require('underscore');
      _s = require('underscore.string');
      request = require('request');
      cmd = require('node-cmd');
      Firebase = require('firebase');
      parseString = require('xml2js').parseString;
      missed = 0;
      total = 0;
      imagesSaved = 0;
      options = {};
      imageList = [];
      partNumbers = [];
      missedPartNumbers = [];
      size_code='';
      share = 'datafiles';
      directory = 'qa';
      fileShare = 'interfacecampaigns';
      fileShareKey = 'cfiEpxphPrJzIsI8bL5a5hCSF5Rn1zFVWPcm3Z323IFA+dbmpr9xgSHm1hXHz24x4d+4Z5tU/Ri+70VL7Lh09g==';
      revision = Date.now();
      toPercent = function(num, total) {
        return num / total * 100;
      };
      zeroFill = function(number, width) {
        if (!number) {
          return '00';
        }
        width -= number.toString().length;
        if (width > 0) {
          return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + '';
      };
      getLatestCSV = (function(_this) {
        return function(error, result, response) {
          var fileNames, newestFileName;
          fileNames = void 0;
          newestFileName = void 0;
          fileNames = _.pluck(result.entries.files, 'name');
          newestFileName = fileNames.pop();
          console.log('newestFileName: ' + newestFileName);
          return fileService.getFileToText(share, directory, newestFileName, options, parseCSV);
        };
      })(this);
      parseCSV = (function(_this) {
		   console.log("parseCSV");
        return function(err, result) {
          result = result.replace(/\#/g, '');
          return csv.parse(result, {
            columns: true,
            trim: true,
            skip_lines_with_empty_values: true,
            skip_empty_lines: true
          }, extractCustoms);
        };
      })(this);
      extractCustoms = (function(_this) {
        return function(err, dataresult) {
          console.log('extract customs');
          if (err) {
            console.log(err);
          }
          total = dataresult.length;
          
          var x,y,chunk_block =60,text= "";
for (x=0,y=total; x<y; x+=chunk_block) {
    //temparray = array.slice(i,i+chunk);
    // text += chunk + "<br>";

console.log(chunk_block);

          var i,j,temparray,chunk = 10;
            for (i=0,j=dataresult.length; i<j; i+=chunk) {
                temparray = dataresult.slice(i,i+chunk);
            
          console.log("temparray length"+temparray.length);
          _.each(temparray, function(row, index) {
              
             //console.log('dataresult'+JSON.stringify(dataresult)+"\n");
            var addImageDataWithRow, scene7request, scene7search, search, sizeCode;
            if (row.COLOR.indexOf('CUSTOM') > -1 || row.RADSTOCK === 'R') {
                console.log('search start'+row.E1ITEM);
              search = row.E1ITEM.trim();
              sizeCode = row.E1ITEM.substring(12, 14);
              size_code = sizeCode;
            //   if (sizeCode === '7A') {
            //     sizeCode = '7S';
            //   }
            //   if (sizeCode === '5B') {
            //     sizeCode = '5S';
            //   }
              scene7search = search.slice(0, -7);
              scene7request = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><SOAP-ENV:Header><authHeader xmlns="http://www.scene7.com/IpsApi/xsd/2016-01-14-beta"><user>scott+api@peopledesign.com</user><password>enW1L6JjxL$</password><locale>en-US</locale><appName>Adobe.Scene7.SPS</appName><appVersion>6.10-194940</appVersion><faultHttpStatusCode>200</faultHttpStatusCode></authHeader></SOAP-ENV:Header><SOAP-ENV:Body><searchAssetsByMetadataParam xmlns="http://www.scene7.com/IpsApi/xsd/2016-01-14-beta"><companyHandle>c|28267</companyHandle><filters><includeSubfolders>true</includeSubfolders><assetTypeArray><items>Image</items></assetTypeArray><excludeByproducts>false</excludeByproducts><trashState>NotInTrash</trashState></filters><metadataConditionArray>';
              scene7request += '<items><fieldHandle>name</fieldHandle><op>StartsWith</op><value>' + scene7search + '</value></items>';
              scene7request += '<items><fieldHandle>name</fieldHandle><op>Contains</op><value>' + sizeCode + '</value></items>';
              scene7request += '<items><fieldHandle>name</fieldHandle><op>EndsWith</op><value>_va1</value></items></metadataConditionArray><metadataConditionMatchMode>MatchAll</metadataConditionMatchMode><recordsPerPage>1</recordsPerPage><resultsPage>1</resultsPage><sortBy>created_at</sortBy><sortDirection>Ascending</sortDirection></searchAssetsByMetadataParam></SOAP-ENV:Body></SOAP-ENV:Envelope>';
              addImageDataWithRow = _.partial(addImageData, search, row);
              setTimeout(function () {}, 50);
              return _.throttle(request.post({
                url: 'https://s7sps1apissl.scene7.com/scene7/services/IpsApiService',
                body: scene7request,
                headers: {
                  'SOAPAction': 'searchAssetsByMetadata',
                  'Content-Type': 'text/xml',
                  'charset': 'utf-8'
                }
              }, addImageDataWithRow),5000);
            } else {
              return missed++;
            }
			console.log('search end'+row.E1ITEM);
          });
            }
          

}      
          
       
          
          
          
        };
      })(this);
      addImageData = (function(_this) {
        return function(search, row, err, response, body) {
        
                //console.log(response);
          //console.log('response++'+JSON.stringify(response));
          if (err) {
            console.log(err);
            console.log(row);
            console.log(body);
          }
          return parseString(body, function(err, result) {
            var assetName, path, results, totalRows;
            assetName = void 0;
            path = void 0;
            results = void 0;
            totalRows = void 0;
            if (result['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault']) {
              //console.log(JSON.stringify(result['soapenv:Envelope']['soapenv:Body'][0]));
            }
            totalRows = result['soapenv:Envelope']['soapenv:Body'][0].searchAssetsByMetadataReturn[0].totalRows[0];
            results = result['soapenv:Envelope']['soapenv:Body'][0].searchAssetsByMetadataReturn[0].assetSummaryArray[0];
            //console.log(results);
            if (results) {
              assetName = results.items[0].filename[0];
              if (assetName) {
                path = 'http://media.interface.com/is/image/InterfaceInc/' + assetName;
                imageList.push({
                  'id': search,
                  'url': path,
                  'assetName': assetName,
                  'product': row
                });
              }
            } else {
                console.log("size_code-->",size_code);
             if (size_code === '7A') {
                sizeCode = '7S';
                extractCustoms();
              }
              if (size_code === '5B') {
                sizeCode = '5S';
                extractCustoms();
              }
              missed++;
              missedPartNumbers.push(search);
              console.log('missed ' + search);
            }
            //console.log(total, missed, imageList.length);
            if (imageList.length === total - missed) {
              console.log('ready to pull colors');
              return extractColors(imageList, saveJSON);
            }
          });
        };
        
        
        
      })(this);
      extractColors = (function(_this) {
        return function(images, callback) {
          var assetNames, backingCodeMap, configMap, imageInfo, imageURLs, installMap, myFirebaseRef, products, sizeMap, synced;
          assetNames = void 0;
          backingCodeMap = void 0;
          configMap = void 0;
          imageInfo = void 0;
          imageURLs = void 0;
          installMap = void 0;
          myFirebaseRef = void 0;
          products = void 0;
          sizeMap = void 0;
          synced = void 0;
          Firebase = require('firebase');
          console.log('extract colors');
          backingCodeMap = {
            '2500': ['50cm x 50cm', 'GlasBac® Tile'],
            '250H': ['50cm x 50cm', 'GlasBac® RE Tile'],
            '250A': ['50cm x 50cm', 'NexStep® Tile'],
            '250M': ['50cm x 50cm', 'NexStep® Tile'],
            '250E': ['50cm x 50cm', 'GlasBac® RE Tile'],
            '2000': ['1m x 1m', 'GlasBac® Tile'],
            '200H': ['1m x 1m', 'GlasBac® RE Tile'],
            '200A': ['1m x 1m', 'NexStep® Tile'],
            '200M': ['1m x 1m', 'NexStep® Tile'],
            '200E': ['1m x 1m', 'GlasBac® RE Tile'],
            'AB00': ['50cm x 1m', 'GlasBac® Tile'],
            'AB0H': ['50cm x 1m', 'GlasBac® RE Tile'],
            'AB0A': ['50cm x 1m', 'NexStep® Tile'],
            'AB0E': ['50cm x 1m', 'GlasBac® RE Tile'],
            'AB0M': ['50cm x 1m', 'NexStep® Tile'],
            'AK00': ['25cm x 1m', 'GlasBac® Tile'],
            'AK0H': ['25cm x 1m', 'GlasBac® RE Tile'],
            'AK0A': ['25cm x 1m', 'NexStep® Tile'],
            'AK0M': ['25cm x 1m', 'NexStep® Tile'],
            'AK0E': ['25cm x 1m', 'GlasBac® RE Tile'],
            'AK0F': ['25cm x 1m', 'Cushionbac Renew Tile'],
            'AB0F': ['50cm x 1m', 'Cushionbac Renew Tile'],
            '200F': ['1m x 1m', 'Cushionbac Renew Tile'],
            '250F': ['50cm x 50cm', 'Cushionbac Renew Tile'],
            'AK01': ['25cm x 1m', 'Moisturegard Plus Tile'],
            'AB01': ['50cm x 1m', 'Moisturegard Plus Tile'],
            '2001': ['1m x 1m', 'Moisturegard Plus Tile'],
            '2501': ['50cm x 50cm', 'Moisturegard Plus Tile'],
            'AK03': ['25cm x 1m', 'Super Cushion Tile'],
            'AB03': ['50cm x 1m', 'Super Cushion Tile'],
            '2003': ['1m x 1m', 'Super Cushion Tile'],
            '2503': ['50cm x 50cm', 'Super Cushion Tile'],
            'AK0R': ['25cm x 1m', 're-cushion Tile'],
            'AB0R': ['50cm x 1m', 're-cushion Tile'],
            '200R': ['1m x 1m', 're-cushion Tile'],
            '250R': ['50cm x 50cm', 're-cushion Tile'],
            'AK04': ['25cm x 1m', 'graphlar Tile'],
            'AB04': ['50cm x 1m', 'graphlar Tile'],
            '2004': ['1m x 1m', 'graphlar Tile'],
            '2504': ['50cm x 50cm', 'graphlar Tile'],
            'AK05': ['25cm x 1m', 'graphlex backing'],
            'AB05': ['50cm x 1m', 'graphlex backing'],
            '2005': ['1m x 1m', 'graphlex backing'],
            '2505': ['50cm x 50cm', 'graphlex backing']
          };
          sizeMap = {
            '5B': '50 cm x 50 cm',
            '5S': '50 cm x 50 cm',
            '1B': '1 m x 1 m',
            '7A': '25 cm x 1 m',
            '7B': '50 cm x 1m',
            '7C': '25 cm x 50 cm',
            '4B': 'unknown',
            '3B': 'unknown',
            '8S': 'unknown',
            '7S': '25 cm x 1 m'
          };
          configMap = {
            'Ashlar': '15',
            'Brick': '25',
            'Monolithic': '03',
            'Non-Directional': '09',
            'Quarterturn': '05',
            'Quarter-Turn': '05',
            'Herringbone': '29'
          };
          installMap = {
            '00': 'Monolithic',
            '01': 'Quarter-Turn',
            '02': 'Monolithic',
            '03': 'Monolithic',
            '04': 'Monolithic',
            '05': 'Quarter-Turn',
            '06': '',
            '07': '',
            '08': 'Ashlar',
            '09': 'Non-Directional',
            '10': 'Herringbone',
            '11': 'Ashlar',
            '12': 'Brick',
            '13': 'Brick',
            '14': 'Brick',
            '15': 'Ashlar',
            '16': 'Ashlar',
            '17': 'Monolithic',
            '18': 'Brick',
            '19': 'Ashlar',
            '20': 'Brick',
            '21': 'Brick',
            '22': 'Non-Directional',
            '23': 'Brick',
            '24': 'Brick',
            '25': 'Brick',
            '26': 'Ashlar',
            '27': 'Brick',
            '28': 'Ashlar',
            '29': 'Herringbone',
            '30': 'Brick',
            '31': 'Ashlar',
            '32': 'Brick',
            '33': 'Ashlar',
            '34': '',
            '99': 'Sample',
            'NA': ''
          };
          imageURLs = _.pluck(images, 'url');
          partNumbers = _.pluck(images, 'id');
          products = _.pluck(images, 'product');
          assetNames = _.pluck(images, 'assetName');
          total = images.length;
          imageInfo = {};
          images = [];
          synced = 0;
          myFirebaseRef = new Firebase('https://interfacespecials.firebaseio.com/products/' + revision);
          console.log('Revision: ', revision);
          return _.each(imageURLs, function(image, index) {
            var backingCode, backingName, baseTile, cleanedObject, colorName, colorNumber, dyelotQuantities, dyelotTotal, firstThird, imageinfo_clean, installCode, installLabel, lot, myJSON, name, obj, onComplete, patternNumber, product, quantity, replaceUndefinedOrNull, size, sizeLabel, source, warranty;
            //console.log('image', image);
            //console.log('index', index);
            backingCode = void 0;
            backingName = void 0;
            baseTile = void 0;
            colorName = void 0;
            colorNumber = void 0;
            dyelotQuantities = void 0;
            dyelotTotal = void 0;
            firstThird = void 0;
            installCode = void 0;
            installLabel = void 0;
            lot = void 0;
            name = void 0;
            onComplete = void 0;
            patternNumber = void 0;
            product = void 0;
            quantity = void 0;
            size = void 0;
            sizeLabel = void 0;
            source = void 0;
            warranty = void 0;
            colorName = _s.titleize(products[index].COLOR.split(' ')[0]);
            colorNumber = products[index].THIRDITEM.split('.')[1];
            patternNumber = products[index].THIRDITEM.split('.')[2].split('M')[1];
            if (patternNumber !== null && typeof patternNumber !== "undefined") {
              patternNumber = 'M' + patternNumber;
            }
            installCode = zeroFill(products[index].INSTALLMTH, 2);
            installLabel = installMap[installCode];
            if (installLabel === null) {
              installLabel = '';
            }
            firstThird = products[index].THIRDITEM.split('.')[0];
            backingName = '';
            if (firstThird !== null) {
              backingCode = firstThird.substr(firstThird.length - 4);
              console.log(backingCode + "backingCode");
			  console.log(backingCodeMap[backingCode]+"-->backingCodeMap[backingCode]");
              if (backingCodeMap[backingCode] !== null) {
                console.log(backingCodeMap[backingCode] + "-->backingCodeMap");
                backingName = backingCodeMap[backingCode][1];
              }
            }
            lot = _s.trim(products[index].LOT);
            name = _s.titleize(products[index].DESC.split('.')[0]);
            quantity = parseFloat(products[index].AVAILQTY.replace(',', ''));
            warranty = products[index].E1ITEM.slice(-1) === 'R' ? false : true;
            size = products[index].E1ITEM.substring(12, 14);
            sizeLabel = sizeMap[size];
            product = {
              'colorName': colorName,
              'colorNumber': colorNumber,
              'install': installCode,
              'installLabel': installLabel,
              'backing': backingName,
              'lot': lot,
              'name': name,
              'quantity': quantity,
              'warranty': warranty,
              'size': size,
              'sizeLabel': sizeLabel
            };
            if (patternNumber !== null) {
              product.patternNumber = patternNumber;
            }
            baseTile = assetNames[index].split('_va1')[0];
            images[index] = {
              'tile': {
                'baseURL': 'http://media.interface.com/is/image/InterfaceInc/' + baseTile + '_va1'
              },
              'config': {
                'baseURL': 'http://media.interface.com/is/image/InterfaceInc/install_' + configMap[installLabel] + '_' + size + '?$tile=InterfaceInc/' + baseTile
              },
              'scene': {
                'baseURL': 'http://interfaceinc.scene7.com/ir/render/InterfaceIncRender/us_corridor?&resmode=sharp2&qlt=80,1&obj=main&res=45.72&sharp=1&src=is{InterfaceInc/install_' + configMap[installLabel] + '_' + size + '_room?$tile=InterfaceInc/' + baseTile + '}'
              }
            };
            // if (imageInfo[partNumbers[index]]) {
            //   imageInfo[partNumbers[index]].dyelots.push({
            //     lot: product.lot,
            //     quantity: product.quantity
            //   });
            //   imageInfo[partNumbers[index]].dyelotCount = imageInfo[partNumbers[index]].dyelots.length;
            //   dyelotQuantities = _.pluck(imageInfo[partNumbers[index]].dyelots, 'quantity');
            //   dyelotTotal = 0;
            //   _.each(dyelotQuantities, function(quant) {
            //     return dyelotTotal += parseFloat(quant);
            //   });
            //   imageInfo[partNumbers[index]].dyelotTotal = dyelotTotal;
            // } else {
              source = JSON.stringify(products[index]);
              source = source.replace(/\"\":\"\"\,/g, '');
              source = JSON.parse(source);
              imageInfo[partNumbers[index]] = {
                'id': partNumbers[index],
                'images': images[index],
                'dyelots': [
                  {
                    'lot': product.lot,
                    'quantity': product.quantity
                  }
                ],
                'dyelotTotal': product.quantity,
                'dyelotCount': 1,
                'product': product,
                'source': source
              };
            //}
            myFirebaseRef = new Firebase('https://interfacespecials.firebaseio.com/products/' + revision + '/imageInfo/' + partNumbers[index]);
            onComplete = function(error) {
              if (error) {
                return console.log('Synchronization failed');
              } else {
                synced++;
                if (imageURLs.length === synced) {
                  console.log('synced ' + synced);
                  return process.exit();
                }
              }
            };
            obj = imageInfo[partNumbers[index]];
            myJSON = JSON.stringify(obj);
            console.log(myJSON + 'myJSON');
            replaceUndefinedOrNull = function(key, value) {
              if (value === null || value === void 0) {
                console.log('json undefined' + '-->' + key + ' is ' + value);
                return void 0;
              }
              return value;
            };
            cleanedObject = JSON.stringify(obj, replaceUndefinedOrNull, 4);
            imageinfo_clean = JSON.parse(cleanedObject);
            myFirebaseRef.set(imageinfo_clean, onComplete);
            imagesSaved++;
            if (imagesSaved === total) {
              console.log('we have them all now');
              return callback(imageInfo);
            }
          });
        };
      })(this);
      saveJSON = (function(_this) {
        return function(imageInfo) {
          var myFirebaseRef;
          myFirebaseRef = void 0;
          myFirebaseRef = new Firebase('https://interfacespecials.firebaseio.com/products/' + revision + '/missedPartNumbers');
          myFirebaseRef.set(missedPartNumbers);
          console.log('all done');
          return true;
        };
      })(this);
      fileService = azure.createFileService(fileShare, fileShareKey);
      return fileService.listFilesAndDirectoriesSegmented(share, directory, options, getLatestCSV);
    }).call(this);
  }).call(this);

}).call(this);
